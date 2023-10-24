## A Basic ElevenLabsClient SDK for Typescript (unofficial)

### Introduction

The `ElevenLabsClient` SDK provides an interface to interact with the ElevenLabs API, allowing you to manage voices, their settings, and perform text-to-speech operations.


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

---


### Initialization

Before making any requests, instantiate the `ElevenLabsClient` with your API key:

```typescript
const client = new ElevenLabsClient('YOUR_API_KEY');
```

### Methods

#### 1. `getVoices()`

Fetches all available voices.

- **Returns**: Promise with an array of `IVoiceData`

```typescript
const voices = await client.getVoices();
```

#### 2. `getVoice(voiceId: string)`

Fetches details of a specific voice.

- **Parameters**: 
  - `voiceId`: ID of the voice.
  
- **Returns**: Promise with `IVoiceData`

```typescript
const voice = await client.getVoice('VOICE_ID');
```

#### 3. `createVoice(name: string, files: IFile[])`

Creates a new voice.

- **Parameters**: 
  - `name`: Name of the voice.
  - `files`: Array of files.
  
- **Returns**: Promise with `IVoiceData`

```typescript
const newVoice = await client.createVoice('NewVoiceName', files);
```

#### 4. `updateVoice(voiceId: string, name: string, files: IFile[])`

Updates an existing voice.

- **Parameters**: 
  - `voiceId`: ID of the voice.
  - `name`: Updated name.
  - `files`: Updated files.
  
- **Returns**: Promise with `IVoiceData`

```typescript
const updatedVoice = await client.updateVoice('VOICE_ID', 'UpdatedVoiceName', updatedFiles);
```

#### 5. `deleteVoice(voiceId: string)`

Deletes a voice.

- **Parameters**: 
  - `voiceId`: ID of the voice.

```typescript
await client.deleteVoice('VOICE_ID');
```

#### 6. `getVoiceSettings(voiceId: string)`

Fetches the settings of a specific voice.

- **Parameters**: 
  - `voiceId`: ID of the voice.
  
- **Returns**: Promise with `IGetVoiceSettingsResponse`

```typescript
const voiceSettings = await client.getVoiceSettings('VOICE_ID');
```

#### 7. `editVoiceSettings(voiceId: string, settings: IEditVoiceSettings)`

Edits the settings of a specific voice.

- **Parameters**: 
  - `voiceId`: ID of the voice.
  - `settings`: New settings for the voice.
  
- **Returns**: Promise with `IVoiceSettings`

```typescript
const updatedSettings = await client.editVoiceSettings('VOICE_ID', newSettings);
```

#### 8. `textToSpeech(options: ITextToSpeechOptions)`

Converts text to speech.

- **Parameters**: 
  - `options`: Text to speech options.
  
- **Returns**: Promise with `Uint8Array`

```typescript
const audioData = await client.textToSpeech(options);
```

#### 9. `textToSpeechStream(voiceId: string, options: ITextToSpeechOptions)`

Fetches the text-to-speech stream.

- **Parameters**: 
  - `voiceId`: ID of the voice.
  - `options`: Text to speech options.
  
- **Returns**: Promise with `NodeJS.ReadableStream`

```typescript
const audioStream = await client.textToSpeechStream('VOICE_ID', options);
```

#### 10. `getHistory()`

Fetches the history.

- **Returns**: Promise with an array of `IHistoryItem`

```typescript
const history = await client.getHistory();
```

#### 11. `getUser()`

Fetches the user details.

- **Returns**: Promise with `IUser`

```typescript
const user = await client.getUser();
```

#### 12. `getSubscription()`

Fetches the user's subscription details.

- **Returns**: Promise with `ISubscription`

```typescript
const subscription = await client.getSubscription();
```

### Types

Here are some of the main types used:

- `IVoiceData`
- `IFile`
- `IVoiceSettings`
- `ITextToSpeechOptions`
- `IEditVoiceSettings`
- `IGetVoiceSettingsResponse`
- `IHistoryItem`
- `IUser`
- `ISubscription`

Refer to the SDK source code for detailed structure of each type.
