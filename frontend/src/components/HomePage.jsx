import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h2 className="text-4xl font-bold mb-4 text-white">Добро пожаловать в Акинатор!</h2>
      <p className="text-white mb-6">Загадай персонажа, а Джинн попытается его угадать!</p>
      <Link to="/game" className="px-6 py-3 text-white rounded-lg" class="link">
        Начать Игру
      </Link>
      <img src="/genie-happy.png"></img>
    </div>
  );
}

export default HomePage;
