import { Calendar, MapPin, Car, User, Phone, Mail, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  return (
    <section className="min-h-screen pt-20 bg-wedding-gray">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            İletişim
          </h2>
          <p className="text-xl text-gray-600">Düğün detayları ve iletişim bilgileri</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Wedding Details */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-semibold mb-6">Düğün Detayları</h3>
              
              <div className="space-y-6">
                <div className="flex items-start" data-testid="wedding-date-time">
                  <div className="w-12 h-12 bg-wedding-rose rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Calendar className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Tarih ve Saat</h4>
                    <p className="text-gray-600">23 Ağustos 2025, Cumartesi - 19:00</p>
                  </div>
                </div>
                
                <div className="flex items-start" data-testid="wedding-venue">
                  <div className="w-12 h-12 bg-wedding-rose rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Mekan</h4>
                    <p className="text-gray-600">
                      Valentin Wedding<br />
                      Kurttepe Suna Kan Blv 39/1A
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start" data-testid="parking-info">
                  <div className="w-12 h-12 bg-wedding-rose rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Car className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Park Alanı</h4>
                    <p className="text-gray-600">Ücretsiz vale park hizmeti mevcut</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-semibold mb-6">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <div data-testid="bride-contact">
                  <h4 className="font-semibold text-gray-800 mb-3">Gelin Tarafı</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-5 text-gray-500 mr-3" size={16} />
                      <span className="text-gray-600">Mihbiran Kaya</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 text-gray-500 mr-3" size={16} />
                      <span className="text-gray-600">+90 532 xxx xx xx</span>
                    </div>
                  </div>
                </div>
                
                <div data-testid="groom-contact">
                  <h4 className="font-semibold text-gray-800 mb-3">Damat Tarafı</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-5 text-gray-500 mr-3" size={16} />
                      <span className="text-gray-600">Çağatay Özdemir</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 text-gray-500 mr-3" size={16} />
                      <span className="text-gray-600">+90 533 xxx xx xx</span>
                    </div>
                  </div>
                </div>
                
                <div data-testid="organization-contact">
                  <h4 className="font-semibold text-gray-800 mb-3">Organizasyon</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-5 text-gray-500 mr-3" size={16} />
                      <span className="text-gray-600">info@mihbiranvecagatay.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-semibold mb-6">Konum</h3>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="mx-auto text-4xl mb-4" size={48} />
                  <p className="text-lg font-medium">Harita Yükleniyor...</p>
                  <p className="text-sm">Google Maps entegrasyonu yapılacak</p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  data-testid="directions-link"
                >
                  <Navigation className="mr-2" size={16} />
                  Yol Tarifi Al
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
