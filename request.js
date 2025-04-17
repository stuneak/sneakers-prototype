import fs from 'fs/promises';
async function getSneakerProduct() {
	// To search for a specific brand, e.g., "Jordan"
	const brandName = 'Nike'; // Or any other brand
	const url = `https://api.sneakersapi.dev/api/v3/stockx/products?brand=${encodeURIComponent(
		brandName
	)}&display[variants]=true`;
	const outputFilePath = 'sneaker_data.json'; // Define the output file path

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'your token', // Do not include prefixes like Bearer or Basic
				'Content-Type': 'application/json', // Usually good practice, though maybe not strictly required for GET
			},
		});

		if (!response.ok) {
			// Throw an error with the status text if the response is not successful
			throw new Error(
				`HTTP error! status: ${response.status} - ${response.statusText}`
			);
		}

		const data = await response.json(); // Parse the JSON response
		console.log('Sneaker data received:', data);

		// Write the data to a JSON file
		await fs.writeFile(outputFilePath, JSON.stringify(data, null, 2));
		console.log(`Successfully wrote sneaker data to ${outputFilePath}`);

		return data; // Return the data
	} catch (error) {
		console.error('Error fetching sneaker data:', error);
		// Depending on your application's needs, you might want to re-throw the error
		// or return null/undefined/etc.
		throw error;
	}
}

getSneakerProduct();
