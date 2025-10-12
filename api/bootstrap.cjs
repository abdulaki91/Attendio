import("./index.js")
  .then(() => console.log("✅ App started via bootstrap.cjs"))
  .catch((err) => {
    console.error("❌ Failed to start app:", err);
  });
