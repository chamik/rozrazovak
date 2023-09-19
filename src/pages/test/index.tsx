

export const TestView: React.FC = () => {

    const questions = [
        {
            id: 1,
            questionText: "I should get _ now.",
            answers: ["away", "out", "going", "in"],
        },
        {
            id: 2,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
    ]

    return (
        <main className="purple-gradient h-screen">
            <div className="flex flex-col mx-auto h-screen p-7 max-w-5xl">
                {questions.map(q => (
                    <div>
                        {q.id}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default TestView;