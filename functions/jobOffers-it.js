const axios = require("axios");
const fs = require("fs");

exports.handler = async (event, context) => {
    const apiKey = "patvjqnVU4e0oOyBI.b34c0d9063373f86d9d46c176bbdf4fe0a7a4b19debdfb31d040aaeb087fb77e";
	const baseId = "appGRzBDiRiDQg6We";
	const tableId = "tblp0mhlI42sWQf0D";
	const pageSize = 100;
	const recordLimit = 1501;
	const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

	let allData = [];
    let recordsRetrieved = 0;

	try {
        let offset = null;
        let response;

        while (recordsRetrieved < recordLimit) {
            response = await axios.get(url, {
                headers: { Authorization: `Bearer ${apiKey}` },
                params: {
                    sort: [{ field: "Created_date", direction: "desc" }],
                    pageSize,
                    offset,
                },
            });

            const { records, offset: nextPageOffset } = response.data;

            for (const record of records) {
                if (recordsRetrieved >= recordLimit) {
                    break; // Stop the loop if record limit is reached
                }

                const { ...fields } = record.fields;

                if (fields.Job_description) {
                    fields.Job_description = fields.Job_description
                        .split("\n")
                        .map((paragraph) => `<p>${paragraph.trim()}</p>`)
                        .join("");
                }

                allData.push({ ...fields });
                recordsRetrieved++;
            }

            offset = nextPageOffset;
            if (!offset) {
                break; // Stop the loop if no more records to retrieve
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(allData),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
			headers: {
				"Content-Type": "application/json",
			},
		};
	}
};
