const axios = require("axios");
const fs = require("fs");

exports.handler = async (event, context) => {
    const apiKey = "patvjqnVU4e0oOyBI.b34c0d9063373f86d9d46c176bbdf4fe0a7a4b19debdfb31d040aaeb087fb77e";
    const baseId = "appGRzBDiRiDQg6We";
    const tableId = "tblYoc4Gw4qkIdBU8";

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${apiKey}` },
            params: { sort: [{ field: "Created_date", direction: "desc" }] },
        });

        const data = response.data.records
            .map((record) => {
                const { Email, Name, Locations, Benefits, ...fields } = record.fields;
                return { ...fields, Locations: Locations.split(", "), Benefits: Benefits.split(", ") };
            })
            .filter((item) => item.Status === "Published");

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
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
