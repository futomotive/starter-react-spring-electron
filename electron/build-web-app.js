const shell = require("shelljs");

shell.echo("### Building Web App...");

shell.echo("### Building Web App: Frontend...");
shell.cd("../frontend");
const PUBLIC = "../backend/src/main/resources/public/";
shell.rm("-rf", PUBLIC);
if (shell.exec("yarn").code !== 0) {
  shell.echo("Error: Frontend installation of dependencies failed");
  shell.exit(1);
}
if (shell.exec("yarn build").code !== 0) {
  shell.echo("Error: Frontend build failed");
  shell.exit(1);
}
shell.cp("-R", "build/", PUBLIC);

shell.echo("### Building Web App: Backend");
shell.cd("../backend");
const gradlew = process.platform === "win32" ? "gradlew" : "./gradlew";
if (shell.exec(gradlew + " clean build bootJar").code !== 0) {
  shell.echo("Error: Backend build failed");
  shell.exit(1);
}
