import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const VALID_SUITES = ["cmr", "albumbuddy", "admin", "all"];

export async function POST(request: NextRequest) {
  const pat = process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!pat || !owner || !repo) {
    return NextResponse.json(
      { error: "Server misconfigured: GitHub credentials not set" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { suite, project, spec, grep, retries } = body;

  if (!suite || !VALID_SUITES.includes(suite)) {
    return NextResponse.json(
      { error: `Invalid suite. Must be one of: ${VALID_SUITES.join(", ")}` },
      { status: 400 }
    );
  }

  const retriesNum = parseInt(retries ?? "1", 10);
  if (isNaN(retriesNum) || retriesNum < 0 || retriesNum > 5) {
    return NextResponse.json(
      { error: "retries must be 0-5" },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: pat });

  try {
    await octokit.rest.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: "playwright.yml",
      ref: "main",
      inputs: {
        suite,
        project: project || "",
        spec: spec || "",
        grep: grep || "",
        retries: String(retriesNum),
      },
    });

    // workflow_dispatch는 run_id를 직접 반환하지 않으므로
    // GitHub Actions 페이지 URL을 반환
    const actionsUrl = `https://github.com/${owner}/${repo}/actions/workflows/playwright.yml`;

    return NextResponse.json({
      ok: true,
      message: `${suite} 테스트 트리거 성공`,
      actionsUrl,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `GitHub API 호출 실패: ${message}` },
      { status: 502 }
    );
  }
}
