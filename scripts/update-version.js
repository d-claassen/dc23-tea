const fs = require("fs");

// Get version from command-line argument
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Please provide a version as argument.");
  process.exit(1);
}

// Path to your main WordPress plugin file (update as needed)
const pluginFile = "../dc23-tea.php";

try {
  let content = fs.readFileSync(pluginFile, "utf8");

  // Update the Version header (assumes "Version: X.X.X" format)
  content = content.replace(/(Version:\s*)(\d+\.\d+\.\d+)/, `$1${newVersion}`);

  fs.writeFileSync(pluginFile, content);
  console.log(`Updated ${pluginFile} to version ${newVersion}`);
} catch (error) {
  console.error(`Error updating version: ${error.message}`);
  process.exit(1);
}