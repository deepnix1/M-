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
                      Kurttepe, Suna Kan Blv 39/1A<br />
                      01170 Çukurova/Adana
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
                      <span className="text-gray-600">Mihriban DAL</span>
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
                      <span className="text-gray-600">Çağatay DAL</span>
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
              <div className="h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3297.8825456!2d35.2655577!3d37.0691087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1528893ee944697f%3A0x73286f9f24e6d6dc!2sValentin%20Wedding!5e0!3m2!1str!2str!4v1692547847000!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Valentin Wedding Konumu"
                ></iframe>
              </div>
              <div className="mt-4">
                <a
                  href="https://maps.app.goo.gl/9MrzRhy6XEgAd9jV7"
                  target="_blank"
                  rel="noopener noreferrer"
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
