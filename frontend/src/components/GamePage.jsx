import { useState, useEffect } from 'react';
import axios from 'axios';

function GamePage() {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('Нажмите чтобы начать');
  const [isGuessing, setIsGuessing] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [genieState, setGenieState] = useState('thinking');
  const [lastCharacters, setLastCharacters] = useState(() => {
    const saved = localStorage.getItem('lastCharacters');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    setGenieState('asking');
    const firstQuestion = await askClaude([
      { role: "user", content: `Ты — искусственный интеллект, играющий в "Акинатор".

1. Ты задаешь вопросы, на которые можно ответить только "Да", "Нет" или "Не знаю".
2. После каждых 20 вопросов ты пытаешься угадать конкретного персонажа или реальную знаменитость.
3. Угадывать **абстрактные понятия нельзя**. Можно угадывать только:
   - известных людей (актеров, певцов, ученых, политиков и т.д.),
   - известных персонажей из фильмов, книг, игр, мифов и т.д.
4. Тебе нельзя говорить про "обычного человека" или "какого-то мужчину".
5. Если ты не уверен, просто задай следующий вопрос.
6. Никогда не проси дополнительных подсказок.
7. Игра должна идти от общих вопросов к более конкретным.



` }
    ]);
    setMessages([]);
    setCurrentQuestion(firstQuestion);
  };

  const handleAnswer = async (answer) => {
    const updatedMessages = [
      ...messages,
      { role: "assistant", content: currentQuestion },
      { role: "user", content: answer }
    ];

    setMessages(updatedMessages);

    try {
      setGenieState('thinking');
      const nextQuestion = await askClaude(updatedMessages);

      if (nextQuestion.includes('Я думаю, ты загадал')) {
        setIsGuessing(true);
        setGenieState('happy');
      } else {
        setGenieState('asking');
      }

      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error(error);
      alert('Ошибка при обращении к ИИ.');
    }
  };

  const askClaude = async (messages) => {
    try {
      const response = await axios.post('https://akinator-clone-server.onrender.com/api/ask', { messages });
  
      const text = response?.data?.message;
      if (!text) {
        throw new Error('Не удалось получить текст от ИИ.');
      }
  
      return text.replace(/# Акинатор/g, '').replace(/\*\*/g, '').trim();
    } catch (error) {
      console.error('Ошибка запроса к серверу:', error);
      throw error;
    }
  };
  

  const extractCharacterName = (text) => {
    const match = text.match(/Я думаю, ты загадал(?:а)? (.+?)(\.|$)/i);
    return match ? match[1] : null;
  };

  const handleFinalAnswer = (answer) => {
    if (answer === 'Угадал') {
      const characterName = extractCharacterName(currentQuestion);
      if (characterName) {
        const updatedCharacters = [characterName, ...lastCharacters].slice(0, 5);
        setLastCharacters(updatedCharacters);
        localStorage.setItem('lastCharacters', JSON.stringify(updatedCharacters));
      }
    }
    setFinalAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">

      <img
        src={genieState === 'thinking'
          ? '/genie-thinking.png'
          : genieState === 'happy'
          ? '/genie-happy.png'
          : '/genie-normal.png'}
        alt="Genie"
        className="h-72 mb-6"
      />

      {!finalAnswer ? (
        <>
          <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg text-center text-gray-850 text-lg mb-6 bg-amber-50">
            {currentQuestion}
          </div>

          <div className="flex space-x-4">
            {!isGuessing ? (
              <>
                <button className="px-5 py-2 border border-gray-400 rounded hover:bg-gray-100" onClick={() => handleAnswer('да')}>Да</button>
                <button className="px-5 py-2 border border-gray-400 rounded hover:bg-gray-100" onClick={() => handleAnswer('нет')}>Нет</button>
                <button className="px-5 py-2 border border-gray-400 rounded hover:bg-gray-100" onClick={() => handleAnswer('не знаю')}>Не знаю</button>
              </>
            ) : (
              <>
                <button className="px-5 py-2 border border-green-400 text-green-700 rounded hover:bg-green-50" onClick={() => handleFinalAnswer('Угадал')}>Угадал</button>
                <button className="px-5 py-2 border border-red-400 text-red-700 rounded hover:bg-red-50" onClick={() => handleFinalAnswer('Не угадал')}>Не угадал</button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-gray-700 text-2xl mt-10">
          {finalAnswer === 'Угадала' ? 'Ура! Я угадала!' : 'Эх, не угадала в этот раз.'}
        </div>
      )}
      {lastCharacters.length > 0 && (
        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Последние угаданные персонажи:</h2>
          <ul className="list-disc list-inside text-gray-600">
            {lastCharacters.map((character, index) => (
              <li key={index}>{character}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
  );
}

export default GamePage;
