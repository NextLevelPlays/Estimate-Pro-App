# Estimate Pro: AI Project Manager & Invoicing Assistant - System Design

**Prepared for:** User
**Date:** October 11, 2025
**Author:** Manus AI

## 1. Project Vision: The AI-Powered Office Assistant

You've articulated a clear and powerful vision: an application that does everything a project manager or office secretary can do. I understand this completely. The goal is to create a seamless, intelligent system that automates the entire workflow from initial customer contact to final invoice, freeing up contractors to focus on their work.

This document outlines the technical design to bring that vision to life. We will build an **AI-powered invoicing assistant** that is not just a tool, but a smart, learning partner for the contractor's business.

## 2. System Architecture

The proposed full-stack architecture is designed for security, scalability, and the complex AI processing required. The system is logically separated into the frontend, a backend API, a persistent database, and connections to external AI and financial services.

![System Architecture Diagram](https://private-us-east-1.manuscdn.com/sessionFile/ctJtunVz6ySZSSlmjwvlNL/sandbox/1kenCjfvW24aZGPsopmR0S-images_1760221025786_na1fn_L2hvbWUvdWJ1bnR1L2VzdGltYXRlX3Byb19hcmNoaXRlY3R1cmU.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3RKdHVuVno2eVNaU1NsbWp3dmxOTC9zYW5kYm94LzFrZW5DamZ2VzI0YVpHUHNvcG1SMFMtaW1hZ2VzXzE3NjAyMjEwMjU3ODZfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyVnpkR2x0WVhSbFgzQnliMTloY21Ob2FYUmxZM1IxY21VLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NHwXsVVVQ8gPEEtVU4NYa2zUAY19Ix1eIMONFiwwp2UIWtvzXlCKSWnaiObn6rG6LiBXbdoemW1a78mfzUAfHiXHNHRF4QauqIjKq4uk6ZZ~V1yc7NVvXf5PBjPMIpKt2IDL3KuKFCOc4-UPbPY~Ug~qpqAQNcw6H0PctiBULpf35qeLCRufpDkYWBUhVF5DRjzCYWKVpZUGpVJz7DZa87w4vTubHFLobpW~NAyigPwu~3AwEVnN3HLtwvumOl-MvjPYtvQU6WzD0tVzO26~XOidZvJV25kfUApsAzUJ74T~nPwKB5Q8dL~lGv3aQ53GlcyOX2CCjFD7~ibDVNmrmw__)

### Key Architectural Components:

-   **Frontend (React):** The user interface will be refactored to be a pure client application. It will handle user interaction and make secure calls to the backend API for all data and AI-related tasks.
-   **Backend API (Node.js/Express):** This is the central nervous system of the application. It will manage user authentication, handle all business logic, securely store API keys, and orchestrate the AI pipeline and QuickBooks integration.
-   **Database (PostgreSQL):** A robust, relational database will securely store all data, including user accounts, client information, estimates, jobs, and—most importantly—the feedback data needed for the AI to learn and improve.

## 3. The AI-Powered Workflow: From Estimate to Invoice

This workflow is designed to be a continuous, learning loop.

| Step | Action | AI/System Function |
| :--- | :--- | :--- |
| 1. **Job Input** | Contractor inputs raw job details (text or speech). | The system transcribes speech to text and sends the raw notes to the AI pipeline. |
| 2. **AI Processing** | The AI pipeline processes the input. | - **Scope Generation:** An LLM refines the notes into a professional scope.<br>- **Market Research:** An AI agent researches current material/labor costs from web sources.<br>- **Line-Item Generation:** The LLM creates a detailed, priced list of items based on the research. |
| 3. **Contractor Review** | The AI-generated estimate is displayed for review. | The contractor can approve the estimate or make edits to prices, quantities, or descriptions. |
| 4. **Learning from Edits** | The system captures all contractor edits. | Every change is saved as a "feedback event" in the database. This data is used to fine-tune the AI, making future estimates more accurate and personalized. |
| 5. **PDF & Email** | Contractor approves the estimate. | The system automatically generates a branded PDF using the contractor's template and emails it to the customer. |
| 6. **QuickBooks Sync** | The customer approves the estimate. | The system automatically creates a corresponding customer and invoice in the contractor's QuickBooks account via the QuickBooks API. |
| 7. **Payment & Project Tracking** | The project is completed and paid. | Payment status from QuickBooks can be synced back to the app. The final invoiced amounts are used as additional feedback to further refine the AI's pricing accuracy. |

## 4. Database Schema

A relational database is crucial for managing the data and the relationships between entities. Below is a simplified schema for the core tables.

| Table: `contractors` | | Table: `estimates` | | Table: `feedback_events` |
| :--- | :--- | :--- | :--- | :--- |
| `id` (PK) | `client_id` (FK) | `id` (PK) |
| `name` | `contractor_id` (FK) | `estimate_id` (FK) |
| `email` | `status` | `original_text` |
| `hashed_password` | `generated_scope` | `edited_text` |
| `logo_url` | `generated_line_items` | `original_price` |
| `theme_colors` | `contractor_edits` | `edited_price` |
| `quickbooks_token` | `final_total` | `timestamp` |

## 5. API Endpoint Specification

The backend will expose a set of secure RESTful API endpoints for the frontend to consume.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new contractor account. |
| `POST` | `/api/auth/login` | Authenticates a contractor and returns a session token. |
| `POST` | `/api/estimates/generate` | **(AI Core)** Takes raw scope input and returns a full, AI-generated estimate. |
| `PUT` | `/api/estimates/:id` | Updates an estimate with contractor edits and triggers the AI feedback loop. |
| `POST` | `/api/estimates/:id/send` | Generates a branded PDF and emails it to the customer. |
| `POST` | `/api/quickbooks/sync` | Syncs an approved estimate to create an invoice in QuickBooks. |
| `GET` | `/api/quickbooks/status/:invoice_id` | Checks the payment status of an invoice in QuickBooks. |

## 6. Conclusion and Next Steps

This design provides a comprehensive blueprint for building the AI-powered office assistant you envisioned. It addresses the need for automated estimation, market research, continuous learning, and seamless QuickBooks integration, all within a secure and scalable architecture.

The next logical step is **Phase 3: Implement enhanced AI features and learning algorithms**. This is where we will begin the development work, starting with setting up the backend server and database, and then building out the core AI and QuickBooks integration features. I am ready to proceed when you are.
