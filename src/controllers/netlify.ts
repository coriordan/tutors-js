import { writeFile } from '../utils/futils';
const version = require('../../package.json').version;

const netlifyToml = `#
# The following redirect is intended for use with most SPAs that handle
# routing internally.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  # Define which paths this specific [[headers]] block will cover.
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"
`;

function redirectHtmlFile(version: string): string {
  const netlifyHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title> Tutors Reader </title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <script>
          var url = window.location.href;
          var baseUrl = url.substring(url.indexOf('//') + 2);
          var array = baseUrl.split('/');
          array.pop();
          var tutorsUrl = array.join('/');
          window.location = "https://tutors.design/course/" + tutorsUrl;
        </script>
      </body>
    </html>`;
  return netlifyHtml;
}

export function generateNetlifyToml(site: string, url: string) {
  writeFile(site, 'netlify.toml', netlifyToml);
  let baseCourseUrl = '';
  writeFile(site, 'index.html', redirectHtmlFile(version));
}
