import DeadMan from '../assets/CrimeImage.jpg';
import { useNavigate } from 'react-router-dom';

function CrimeLineHeader({ title, showButton, navigatePath, buttonText }) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate(navigatePath);
    };

    return (
        <>
            <header className="border-b border-gray-200 bg-gray-50">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div className='flex'>
                            <div>
                                <img src={DeadMan} className="h-20" alt="logo" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-6xl p-3">{title}</h1>
                        </div>

                        {showButton && (
                            <div className="flex items-center gap-4">
                                <button
                                    className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                    type="button"
                                    onClick={handleButtonClick}
                                >
                                    {buttonText}
                                    
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default CrimeLineHeader;
