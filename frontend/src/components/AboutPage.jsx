function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-left" class='about'>
        <h2 className="text-3xl font-bold mb-6">О проекте</h2>

        <p className="mb-6">
          <strong>Akinator Clone</strong> — веб-приложение, где искусственный интеллект угадывает задуманного пользователем персонажа через серию вопросов с вариантами ответов.
        </p>

        <p className="mb-6">
          В основе угадывания лежит интеграция с языковой моделью Claude 3 от Anthropic.
          ИИ динамично генерирует вопросы, анализирует ответы и формулирует догадку. Проект сфокусирован на простоте, понятной логике и приятном пользовательском опыте.
        </p>

        <p className="mb-6">
          <em>Как работает:</em><br />
          1. Генерация вопросов на основе ответов игрока.<br />
          2. Построение гипотезы на основе цепочки ответов.<br />
          3. Попытка угадать задуманного персонажа.
        </p>

        <p className="mb-6">
          Очень надеюсь, что проект передаст мой подход к работе и стремление стать частью вашей команды!
        </p>

        <p className="text-lg text-right"><em>— Nazerke</em></p>
      </div>
    </div>
  );
}

export default AboutPage;
