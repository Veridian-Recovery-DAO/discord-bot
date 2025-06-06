# Veridian Recovery DAO Discord Bot

## 🚀 Overview

Welcome to the Veridian Recovery DAO Discord Bot! This bot is designed to support the Veridian Recovery DAO community by providing tools and resources for addiction recovery. Key features include scheduling and listing recovery meetings, offering AI-powered psychoeducation and crisis intervention guidance, facilitating NFT purchases, interacting with the DAO's ERC20 token, and managing user account settings within the DAO.

The project consists of two main components:
1.  **[https://github.com/Veridian-Recovery-DAO/discord-bot.git](Discord Bot = TypeScript *this repository*):** Handles all Discord interactions, command processing, database interactions (MongoDB), and integrations with Thirdweb for NFT and token functionalities.
2.  **[https://github.com/Veridian-Recovery-DAO/llm-service.git](LLM Service - Python):** A separate FastAPI service that interfaces with a Large Language Model trained in recovery literature to provide psychoeducational support.

---

## ✨ Features & Commands

The bot utilizes Discord slash commands. Here's a breakdown of the available commands and their functionalities:

### 🗓️ Meeting Management
- Schedule, list, modify, and delete recovery meetings.
- Supports recurring meetings with customizable recurrence rules.

* `/schedule-meeting <name> <description> <date> <time> <duration> <room> [recurring] [recurrence_rule]`
    * **Description:** Schedules a new recovery meeting.
    * **Options:**
        * `name`: Name of the meeting (required).
        * `description`: Short description of the meeting (required).
        * `date`: Date of the meeting in YYYY-MM-DD format (required).
        * `time`: Time of the meeting in HH:MM (24-hour) format (required).
        * `duration`: Duration of the meeting in minutes (required).
        * `room`: Meeting room link or information (required).
        * `recurring`: (Optional) Boolean indicating if the meeting is recurring (defaults to false).
        * `recurrence_rule`: (Optional) Text description of the recurrence (e.g., "Daily", "Weekly on Mondays").
    * **Permissions:** Admin/Moderator only (e.g., users with `ManageEvents` permission).

* `/meetings list [filter]`
    * **Description:** Lists scheduled recovery meetings.
    * **Options:**
        * `filter`: (Optional) Filters meetings by `upcoming` (default), `today`, or `all`.
    * **Permissions:** All users.

* `/meetings modify <meeting_id> [name] [description] ...`
    * **Description:** Modifies an existing scheduled meeting.
    * **Options:**
        * `meeting_id`: The MongoDB `_id` of the meeting to modify (required).
        * Other options correspond to meeting details (name, description, date, time, etc.) that can be updated.
    * **Permissions:** Admin/Moderator only.

* `/meetings delete <meeting_id>`
    * **Description:** Deletes/cancels a scheduled meeting.
    * **Options:**
        * `meeting_id`: The MongoDB `_id` of the meeting to delete (required).
    * **Permissions:** Admin/Moderator only.

---
### 🧠 AI Support (LLM Integration)

* `/ask <query>`
    * **Description:** Sends a question or concern to the LLM trained in recovery literature for psychoeducation, urge management counseling, or crisis intervention guidance.
    * **Options:**
        * `query`: The user's question or statement (required).
    * **Permissions:** All users.
    * **Note:** Includes a disclaimer that the AI is not a substitute for professional help and provides crisis hotline information when appropriate.

---
### 🖼️ NFT Interaction (Membership & Support)

* `/nft-info`
    * **Description:** Displays information about the Veridian Recovery DAO's primary NFT (e.g., support NFT).
    * **Permissions:** All users.

* `/buy-nft`
    * **Description:** Provides a link and instructions for purchasing the Veridian Recovery DAO's primary NFT, typically directing to a Thirdweb claim page.
    * **Permissions:** All users.

---
### 🪙 ERC20 Token tokenmands (`/token`)

* `/token info`
    * **Description:** Displays information about the DAO's official ERC20 token (name, symbol, total supply, contract address).
    * **Permissions:** All users.

* `/token transfer <recipient> <amount>`
    * **Description:** Guides the user on how to transfer DAO tokens to another user.
    * **Options:**
        * `recipient`: The Discord user to transfer tokens to (required).
        * `amount`: The amount of tokens to transfer (required).
    * **Permissions:** All users.
    * **Note:** For security, this command provides instructions rather than directly handling private keys or initiating transactions from user wallets.

* `/token purchase`
    * **Description:** Provides information and links on where to purchase the DAO's ERC20 token (e.g., a link to a DEX or a Thirdweb marketplace).
    * **Permissions:** All users.

---
### 🤝 DAO Contribution

* `/contribute`
    * **Description:** Provides a set of instructions in text form on various ways users can contribute to the DAO (e.g., development, content creation, community support).
    * **Permissions:** All users.

* `/donate`
    * **Description:** Provides the DAO's treasury wallet address and instructions for users who wish to donate tokens to support the DAO.
    * **Permissions:** All users.

---
### ⚙️ Account Settings (`/account`)

* `/account profile`
    * **Description:** Allows users to view their DAO-specific profile (e.g., membership status, bio).
    * **Permissions:** All users.

* `/account edit-profile`
    * **Description:** Allows users to modify editable parts of their DAO profile (e.g., bio) using a Discord modal.
    * **Permissions:** All users.

* `/account become-member`
    * **Description:** Provides information and a link for purchasing the official DAO Membership NFT (similar to `/buy-nft` but specifically for membership).
    * **Permissions:** All users.

* `/account delete-account`
    * **Description:** Allows users to request the deletion of their DAO-specific data stored by the bot.
    * **Permissions:** All users.
    * **Note:** This process requires careful consideration of data retention and anonymization policies.

---
## 🛠️ Project Setup

### Prerequisites

* **Node.js:** v16.x or higher (for the Discord bot).
* **npm or pnpm or yarn:** Node.js package manager.
* **Python:** v3.8 or higher (for the LLM service).
* **pip:** Python package manager.
* **MongoDB:** A running instance of MongoDB (local or cloud-hosted like MongoDB Atlas).
* **Discord Bot Application:** Created in the [Discord Developer Portal](https://discord.com/developers/applications).
* **Thirdweb Account:** For deploying and managing NFT and ERC20 token contracts.

### 1. Discord Bot (TypeScript - `src/` directory)

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Veridian-Recovery-DAO/discord-bot.git
    cd discord-bot
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the project root and add the following variables:
    ```env
    DISCORD_BOT_TOKEN=<your_discord_bot_token>
    DISCORD_CLIENT_ID=<your_discord_client_id>
    DISCORD_GUILD_ID=<your_discord_guild_id> # Optional for guild-specific commands
    MONGO_URI=<your_mongo_connection_string>
    THIRDWEB_NFT_CONTRACT_ADDRESS=<your_nft_contract_address>
    THIRDWEB_NFT_CLAIM_PAGE_URL=<your_nft_claim_page_url>
    ERC20_TOKEN_CONTRACT_ADDRESS=<your_erc20_token_contract_address>
    DAO_TREASURY_WALLET_ADDRESS=<your_treasury_wallet_address>
    LLM_API_URL=<your_llm_service_url>
    CHAIN_NAME=mumbai # Example: "mumbai" for Polygon testnet
    ```

4. **Build the Project**:
    ```bash
    npm run build
    ```


5. **Deploy Commands**:
    ```bash
    npm run deploy-commands
    ```

6. **Start the Bot**:
    ```bash
    npm start
    ```

---

## 🚀 Running in Development Mode

To run the bot in development mode with live updates:
    ```
    bash
    npm run dev
    ```

--- 
### 📚 Disclaimer
This service is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, therapy, or crisis intervention. If you are in crisis, please contact a local emergency number or a crisis hotline immediately.

--- 
### 🤝 Contributing
We welcome contributions to improve the service! Whether you're a developer, writer, or someone with lived recovery experience, there are many ways to get involved:
- Code Contributions: Add features or fix bugs.
- Content Contributions: Help curate recovery literature.
- Feedback: Share ideas to improve the service.

---
### 🌐 Related Projects
- Discord Bot: Veridian Recovery DAO Discord Bot
- DAO Initiative: Veridian Recovery Network DAO
- Together, we can build a brighter path to recovery.