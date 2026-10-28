# Kenn Belnas — Portfolio

<p align="center">
  <strong>Real work. Useful systems. Less unnecessary friction.</strong><br>
  A personal portfolio built to show how I think, what I've shipped, and how I turn practical problems into working tools.
</p>

<p align="center">
  <a href="https://workwithkenn.pages.dev">Live portfolio</a> ·
  <a href="https://www.linkedin.com/in/engrkenn">LinkedIn</a> ·
  <a href="mailto:kennclark.yb@gmail.com">Contact me</a>
</p>

---

## The idea

I come from a mix of software development and operations. I like clear information, dependable follow-through, and systems that make everyday work easier.

This site is where those sides meet. It is not just a résumé on a webpage: it brings together my professional experience, practical projects, workflow experiments, and creative work in one place.

I built it as a static website, with the content and interactions kept close to the browser rather than relying on a custom application server.

## Take a look around

- **Featured work** — personal automation and software projects, including Secretary Jihyo and [Y.O.I.N.K.](https://github.com/kennclark-yb/YOINK).
- **Professional experience** — the work, responsibilities, and skills behind the projects.
- **Capabilities** — tools I use, practical strengths, and areas I continue to explore.
- **Currently building** — an in-progress screen-OCR translation tool.
- **Creative work** — photography and color grading, with original/graded comparisons.
- **About & contact** — a little more about me and how to get in touch.

## Built with

This is a hand-authored, static site—not a framework-generated app.

- **HTML** for semantic structure and content.
- **CSS** for layout, responsive behavior, and visual design.
- **Vanilla JavaScript / ES modules** for navigation and progressive enhancements.
- **GSAP + ScrollTrigger** for selected motion effects.
- **ASCII-reveal effects** for the site's characterful text/media treatments.
- **Inter** served locally as a variable web font.
- **Cloudflare Pages** for hosting and deployment.

There is no custom application backend or database required to serve the portfolio. The site is designed to keep meaningful content available even when optional enhancements fail or JavaScript is unavailable.

## Run it locally

No package install or build step is required for the static site.

Some browser features work best when the files are served over HTTP rather than opened directly as `file://` URLs, particularly JavaScript modules.

### Option 1 — Python

From the repository root:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

### Option 2 — VS Code

Open the project folder in Visual Studio Code and use a local static-server extension, such as Live Server.

## Deploy

The production site is hosted on Cloudflare Pages:

**https://workwithkenn.pages.dev**

The production release is tracked on `main`. The site is static, so deployment serves the repository's web files directly; there is no application build command required for the current setup.

For changes, I work on a separate branch, review the preview deployment, test the relevant layouts and interactions, and promote the verified change to production. I try to keep the production branch tied to the exact version that was reviewed.

## Accessibility and resilience

I aim for the site to remain usable beyond its visual effects. The implementation includes semantic landmarks, a skip link, keyboard-operable controls where applicable, reduced-motion handling, responsive layouts, and static fallbacks for several enhanced sections.

The site has been exercised across multiple viewport sizes and interaction paths. That testing is useful evidence, not a claim of formal WCAG certification or a substitute for ongoing browser and assistive-technology testing.

## Credits & acknowledgments

A portfolio can be personal without pretending every dependency was made from scratch. These are the main third-party tools and services used in the current site.

- **[GSAP](https://gsap.com/) and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)** — animation tooling, bundled locally. The distributed files retain their GreenSock copyright/license headers. Review the [GSAP license information](https://gsap.com/community/standard-license/) for the applicable terms.
- **[Inter](https://rsms.me/inter/)** — the locally bundled variable font. Its SIL Open Font License 1.1 is included at [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt).
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — static hosting and deployment.
- **[GitHub](https://github.com/)** — source control and repository hosting.
- **Google, Gmail, Google Calendar, Google Apps Script, Telegram, Notion, and other product names/logos shown in project evidence** — belong to their respective owners. Their names and marks are used to describe tools and integrations, not to imply endorsement or affiliation.
- **AI-assisted development** — I used AI tools, including ChatGPT and Codex, as collaborators for planning, implementation support, iteration, and review. I made the product and content decisions, reviewed the work, and remain responsible for what I publish.

The portfolio's writing, visual direction, original site code, personal photographs, photo grades, résumé, and project evidence are my own unless a particular item is identified otherwise. Some screenshots are illustrative or use synthetic sample content, as noted in their captions.

If I discover another asset that requires a specific attribution or license notice, I will add it here and include the relevant license file where required.

## Reuse & licensing

This repository is public so people can inspect how the portfolio is put together. **Public visibility is not blanket permission to reuse my personal content.**

Unless a file or asset states otherwise, please ask before reusing my original writing, photographs, résumé, personal branding, screenshots, or project-specific creative work. Third-party libraries, fonts, logos, and other assets remain subject to their own licenses and terms; see the notices above and the relevant files.

This README is not a replacement for the license of any third-party component. No endorsement by the named services or trademark owners is implied.

## Contact

For opportunities, collaboration, or questions about the work:

- **Email:** [kennclark.yb@gmail.com](mailto:kennclark.yb@gmail.com)
- **LinkedIn:** [engrkenn](https://www.linkedin.com/in/engrkenn)
- **Portfolio:** [workwithkenn.pages.dev](https://workwithkenn.pages.dev)

---

<p align="center">
  <sub>Made with curiosity, a software-and-operations mindset, and a preference for making the next step easier.</sub>
</p>
