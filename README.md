# Tailsec VS Code Extension

Security scanning directly in VS Code.

## Features
- Inline diagnostics for Kubernetes, Terraform, Docker, Secrets
- Problems panel integration
- Hover tooltips with fix suggestions
- Scan on save (optional)

## Installation
1. `code --install-extension tailsec.tailsec-security`
2. Or search "Tailsec" in the Extensions panel

## Usage
- Press Cmd+Shift+T to run a workspace scan
- Hover over underlined code to see security details
- View all findings in the Tailsec Findings panel

## Configuration
```json
{
  "tailsec.scanners": ["k8s", "terraform", "docker", "secrets"],
  "tailsec.severity": "critical",
  "tailsec.realtime": true
}
```

[![advertisement](https://ads.servead.net/i/064a6fb9-bce3-467f-883c-8d37676e635a.svg)](https://ads.servead.net/c/064a6fb9-bce3-467f-883c-8d37676e635a)
