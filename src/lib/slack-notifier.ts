interface SlackNotificationParams {
  runId: number;
  suite: string;
  status: string;
  total: number;
  passed: number;
  failed: number;
  flaky: number;
}

function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function sendSlackNotification(params: SlackNotificationParams): void {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  if (params.status !== "failed") return;

  const appUrl = getAppUrl();
  const passRate = params.total > 0 ? Math.round((params.passed / params.total) * 100) : 0;

  const payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🚨 *테스트 실패: ${params.suite.toUpperCase()}*`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Suite: \`${params.suite}\` | Pass Rate: *${passRate}%* | Failed: *${params.failed}건*${params.flaky > 0 ? ` | Flaky: *${params.flaky}건*` : ""}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "📊 결과 보기" },
            url: `${appUrl}/runs/${params.runId}`,
          },
        ],
      },
    ],
  };

  // Fire-and-forget: Slack 실패가 파이프라인을 차단하지 않음
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Slack 전송 실패 무시
  });
}
