const { Client } = require("@notionhq/client");

exports.handler = async function() {
  try {
    // 1. Validate environment variables
    if (!process.env.NOTION_API_KEY) {
      throw new Error("NOTION_API_KEY is missing - set in Netlify environment variables");
    }
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error("NOTION_DATABASE_ID is missing - set in Netlify environment variables");
    }

    // 2. Initialize Notion client
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    
    // 3. Test database connection
    const databaseInfo = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        database_name: databaseInfo.title[0]?.plain_text || "Untitled Database"
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function test failed",
        message: error.message
      })
    };
  }
};