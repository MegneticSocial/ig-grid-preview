const { Client } = require("@notionhq/client");

exports.handler = async function(event, context) {
    try {
        const notion = new Client({ auth: process.env.NOTION_API_KEY });
        
        const databaseId = process.env.NOTION_DATABASE_ID;
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "Status",
                select: {
                    equals: "Published"
                }
            },
            sorts: [{
                property: "Date",
                direction: "descending"
            }]
        });

        const posts = response.results.map(page => {
            return {
                id: page.id,
                caption: page.properties.Name.title[0]?.plain_text || "",
                image: page.properties.Image?.files[0]?.file?.url || "",
                date: page.properties.Date?.date?.start || ""
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(posts),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch posts" })
        };
    }
};