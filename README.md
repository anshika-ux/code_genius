# SIRP
# AI Interview Preparation Platform

We are developing SIRP, an AI-powered self-interview preparation platform. This platform leverages the power of AI and machine learning to simulate real interview scenarios, providing users with ML-computed readiness scores, instant feedback on technical accuracy and communication skills, and personalized improvement tips.

## Key Features
## UI Pages
![Home Page](ui_pages/homepage_new.png)
![Feedback and Analysis Page](ui_pages/feedback_new.png)

### Interview Simulator

- Our platform allows students to practice for interviews by engaging in realistic conversations with an AI interviewer, powered by the [OpenAI API](https://openai.com/product#made-for-developers). If you're new to OpenAI API, you can get started [here](https://www.builder.io/blog/stream-ai-javascript).
- Users can choose the type of interview they want to practice, such as MERN, Node, or Java, and receive a series of relevant questions.
- The OpenAI API dynamically generates questions and provides appropriate responses based on student answers.
- The AI adapts its tone and style of questioning to simulate different interviewer behaviors, depending on the type of interview selected.
- We aim to provide a communicative interview experience by utilizing text-to-speech libraries, taking inspiration from the Masai VI platform.

### Personalized Feedback

- Our platform utilizes AI to analyze students' interview responses and offers constructive feedback.
- Feedback covers various aspects, including content, delivery, and overall performance of student answers.
- Strengths and areas for improvement are highlighted, such as communication skills, technical knowledge, or problem-solving abilities.

### User-Friendly Interface

- We prioritize a user-friendly web or mobile interface that is intuitive, visually appealing, and easy to navigate.
- Our goal is to ensure a seamless experience for users, allowing them to focus on interview preparation without encountering technical issues.

## Tech Stacks to Be Used

- **Frontend**: React with Typescript (Mandatory)
- **Styling**: Tailwind CSS (Mandatory)
- **AI Integration**: OpenAI API (If you're new to OpenAI API, check out this [guide](https://www.builder.io/blog/stream-ai-javascript))
- **Data Visualization and Insights**: Charts (optional)
- **Backend Options**: Node.js with Express and MongoDB or Java Spring Boot

## Team Composition

- Each team will consist of 5 members.

### Team Members

- [Devesh](https://github.com/member1)
- [Nikhil Kumar](https://github.com/member2)
- [Satya Indra](https://github.com/member3)
- [Akash mishra](https://github.com/member3)

## Getting Started

To get started with the development of this platform, follow these steps:

1. Clone this repository to your local machine.
2. Set up the required development environment, including React, Tailwind CSS, and the ML backend.
3. Start building and contributing to the project.

## ML Backend

This project now includes a dedicated ML feedback service that evaluates interview answers using a scikit-learn model.

Run it with:

```bash
cd /Users/anshikatripathi/Desktop/workshop/test-workshop/CodeGenius/ml-backend
pip install -r requirements.txt
python app.py
```

The service listens on `http://localhost:5000` and the frontend sends interview answers to `/feedback`.

## License

This project is licensed under the [MIT License](LICENSE).

Happy coding!
