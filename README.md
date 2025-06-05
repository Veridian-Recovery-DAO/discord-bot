# Veridian Recovery DAO Discord Bot

## 🚀 Overview

Welcome to the Veridian Recovery DAO Discord Bot! This bot is designed to support the Veridian Recovery DAO community by providing tools and resources for addiction recovery. Key features include scheduling and listing recovery meetings, offering AI-powered psychoeducation and crisis intervention guidance, facilitating NFT purchases, interacting with the DAO's ERC20 token, and managing user account settings within the DAO.

The project consists of two main components:
1.  **Discord Bot (TypeScript):** Handles all Discord interactions, command processing, database interactions (MongoDB), and integrations with Thirdweb for NFT and token functionalities.
2.  **LLM Service (Python):** A separate FastAPI service that interfaces with a Large Language Model trained in recovery literature to provide psychoeducational support.

---

## ✨ Features & Commands

The bot utilizes Discord slash commands. Here's a breakdown of the available commands and their functionalities:

### 🗓️ Meeting Management

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

### 1. Discord Bot (TypeScript - `discord-bot/` directory)

#### Installation
1.  Navigate to the `discord-bot/` directory:
    ```bash
    cd path/to/veridian-recovery-bot/discord-bot
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # pnpm install
    # or
    # yarn install
    ```

#### Environment Variables
Create a `.env` file in the `discord-bot/` directory by copying `.env.example` and filling in the values:
