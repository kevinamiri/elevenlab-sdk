
Example of usage:

```ts
// 1. Import the SDK and types
import ElevenLabsClient from "./eleven";

// 2. Initialize the SDK with your API key
const client = new ElevenLabsClient('API_KEY');  // Replace with your actual API key

// 3. Use the SDK
async function main() {
    try {
        // Fetch user information
        const user = await client.getUser();
        console.log('User information:', user);
    } catch (error) {
        console.error('Error occurred:', (error as Error).message);
    }
}

main();
```
