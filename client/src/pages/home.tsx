import { Calendar, Heart, Camera, Utensils } from "lucide-react";

export default function Home() {
  return (
    <section className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Mihbiran & Çağatay
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            Birlikte yeni bir hayata başlıyoruz
          </p>
          <div className="mt-8 text-lg text-gray-500 flex items-center justify-center">
            <Calendar className="mr-2" size={20} />
            <span>15 Haziran 2024</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
            alt="Mihbiran ve Çağatay çift portresi"
            className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* Wedding Timeline */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6" data-testid="timeline-nikah">
            <div className="w-16 h-16 bg-wedding-rose rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-2xl text-gray-600" size={24} />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Nikah Töreni</h3>
            <p className="text-gray-600">15:00 - Belediye Nikah Salonu</p>
          </div>
          <div className="p-6" data-testid="timeline-fotograf">
            <div className="w-16 h-16 bg-wedding-rose rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-2xl text-gray-600" size={24} />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Fotoğraf Çekimi</h3>
            <p className="text-gray-600">16:00 - Park Alanı</p>
          </div>
          <div className="p-6" data-testid="timeline-yemek">
            <div className="w-16 h-16 bg-wedding-rose rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="text-2xl text-gray-600" size={24} />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Düğün Yemeği</h3>
            <p className="text-gray-600">19:00 - Grand Hotel</p>
          </div>
        </div>
      </div>
    </section>
  );
}
