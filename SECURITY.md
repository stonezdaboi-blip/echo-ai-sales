# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@echo-ai.com instead of using the issue tracker.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We will acknowledge receipt within 24 hours and provide regular updates.

## Security Measures

### Authentication
- JWT tokens with 7-day expiration
- Passkey/WebAuthn support
- Secure password hashing (bcrypt)

### Data Protection
- HTTPS/TLS encryption in transit
- Database encryption at rest
- Parameterized SQL queries
- Input validation and sanitization

### API Security
- Rate limiting: 5 requests/second per IP
- CORS configured for trusted origins
- Request size limits
- Response headers security

### Infrastructure
- Secrets management via environment variables
- No sensitive data in logs
- Regular dependency updates
- Automated security scanning

### Compliance
- GDPR ready
- SOC 2 compliant architecture
- OWASP Top 10 protection

## Security Checklist

- [ ] Update dependencies regularly
- [ ] Run security scans weekly
- [ ] Review access logs monthly
- [ ] Update passwords every 90 days
- [ ] Enable 2FA for GitHub/AWS
- [ ] Backup database daily
- [ ] Monitor for suspicious activity

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

## Security Updates

Security updates will be released as:
1. Emergency patches for critical issues (same day)
2. Regular patches for high severity (within 7 days)
3. Regular patches for medium severity (within 30 days)

For questions, contact: security@echo-ai.com
