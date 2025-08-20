import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-08-23T19:00:00");
    const startDate = new Date("2025-08-20T00:00:00");

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const start = startDate.getTime();

      // If we're before the start date, show countdown to start
      if (now < start) {
        const difference = start - now;
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else if (now < target) {
        // If we're between start and target, show countdown to wedding
        const difference = target - now;
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Wedding has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const now = new Date().getTime();
  const targetDate = new Date("2025-08-23T19:00:00").getTime();
  const startDate = new Date("2025-08-20T00:00:00").getTime();

  let countdownText = "";
  if (now < startDate) {
    countdownText = "Düğün haftası başlamasına kalan süre";
  } else if (now < targetDate) {
    countdownText = "Düğünümüze kalan süre";
  } else {
    countdownText = "Düğünümüz başladı!";
  }

  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Clock className="text-gray-600 mr-3" size={32} />
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-800">
              {countdownText}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-600 font-medium">Gün</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-600 font-medium">Saat</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-600 font-medium">Dakika</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-600 font-medium">Saniye</div>
            </div>
          </div>
        </div>

        {now >= targetDate && (
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
              <h3 className="font-serif text-2xl font-semibold mb-2">
                🎉 Düğünümüz Başladı! 🎉
              </h3>
              <p className="text-lg">
                Bu özel günümüzü bizimle paylaştığınız için teşekkürler!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
