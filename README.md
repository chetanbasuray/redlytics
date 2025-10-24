# Redlytics

A powerful web-based tool for in-depth analysis of public Reddit user activity.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-redlytics.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://redlytics.vercel.app/)
[![Support Project](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/donatetochetan)

---

Redlytics grabs a Reddit user’s most recent posts and comments (up to ~1000 of each) and generates a beautiful, interactive dashboard with summary statistics, activity visualizations, karma analysis, and much more.

## ✨ Features

Redlytics provides a wide range of analytical insights, all presented in a clean and responsive dashboard:

📊 **Comprehensive Stat Cards**

- Total Posts, Comments, and combined Karma.
- Average karma per post and per comment.
- Estimated account age in days.
- Total awards received on recent content.
- Most and least active hours of the day.

📈 **Interactive Charts & Visualizations**

- **Activity Analysis:** Interactive bar charts showing user activity by day of the week and hour of the day, with a toggle for local timezone or UTC.
- **Historical Trends:** Line charts visualizing user activity and average content score over the entire time period for which data is available.
- **Karma Breakdown:** A modern doughnut chart showing the proportion of karma earned from posts versus comments, with the total karma count displayed in the center.
- **Top Subreddits by Karma:** A horizontal bar chart identifying which communities are the user's biggest sources of karma.
- **Comment Length Distribution:** A bar chart showing if the user tends to write short, medium, or long comments.

🧠 **Content & Language Analysis**

- **Dynamic Word Cloud:** A visually engaging word cloud of the user's most frequently used words, with word size and color indicating frequency.
- **Comment Highlights:** A showcase of the user's highest-voted ("Best") and lowest-voted ("Worst") recent comments.
- **Language Detection:** Identifies the primary languages used in posts and comments, complete with flags.
- **Flair Detection:** Scans all activity to find and display a list of all unique flairs the user has across different subreddits.

🏆 **Awards Showcase**

- A dedicated section that displays all unique awards the user has received on their recent content, complete with icons and counts. (This section only appears if awards have been received).

## 🛠️ How to Use

1. Navigate to **[redlytics.vercel.app](https://redlytics.vercel.app/)**.
2. Enter any valid Reddit username (without the `u/` prefix).
3. Click "Analyze User".
4. Wait a few moments while Redlytics fetches and processes the data.
5. Explore your interactive dashboard!

## ⚙️ Tech Stack

This project is built with modern, browser-native technologies, requiring no complex build setup.

- **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Charts & Visualizations:** [Recharts](https://recharts.org/)
- **Language Detection:** [Franc](https://github.com/wooorm/franc)

## 🔧 Running Locally

Because this is a static web application with no build step, you can run it locally with any simple web server.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    ```

2. **Navigate into the project directory:**

    ```bash
    cd YOUR_REPOSITORY_NAME
    ```

3. **Serve the files:**
    The easiest way is to use the `serve` package. If you don't have it, you can run it directly with `npx`.

    ```bash
    npx serve .
    ```

4. Open your browser and go to the local address provided (usually `http://localhost:3000`).

## 💡 How It Works

1. **Data Fetching:** When a username is submitted, the application makes requests to the public, unauthenticated Reddit JSON API.
2. **CORS Proxy:** To bypass browser CORS (Cross-Origin Resource Sharing) restrictions, all API calls are routed through `corsproxy.io`.
3. **Client-Side Analysis:** Up to 1000 posts and 1000 comments are fetched. All data processing and analysis happens directly in your browser using JavaScript.
4. **Caching:** To improve performance and reduce API load, results for a specific user are cached in-memory for 5 minutes. Analyzing the same user within this window will load the data instantly.
5. **Rendering:** The analysis results are passed to React components which use the Recharts library to render the interactive dashboard.

## ⚖️ Disclaimer

- Redlytics is an independent, third-party tool and is **not affiliated with Reddit Inc.**
- This tool only accesses publicly available user data via the Reddit JSON API. It does not and cannot access private information.
- All data is processed on the client-side (in your browser) and is not stored or logged by this application.

## ❤️ Support the Project

If you find Redlytics useful, please consider supporting its development. It helps keep the project alive and encourages new features!

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/donatetochetan)
