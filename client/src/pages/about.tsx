import couplePhoto from "@assets/WhatsApp Görsel 2025-08-20 saat 22.04.32_c77cff25_1755718163232.jpg";

export default function About() {
  return (
    <section className="min-h-screen pt-20 bg-wedding-gray">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Hikayemiz
          </h2>
          <p className="text-xl text-gray-600">İki kalbin bir olma yolculuğu</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src={couplePhoto}
            alt="Mihriban ve Çağatay romantik an"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
          
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Nasıl Tanıştık</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              2019 yılının güzel bir bahar gününde, ortak arkadaşlarımızın düzenlediği bir etkinlikte tanıştık. 
              İlk bakışta aralarında özel bir bağ olduğunu hissettik. Çağatay'ın samimi gülümsemesi ve 
              Mihriban'ın neşeli enerjisi, o gün hayatlarımızı sonsuza dek değiştirdi.
            </p>
            
            <h3 className="font-serif text-2xl font-semibold mb-4">Birlikte Büyüdük</h3>
            <p className="text-gray-600 leading-relaxed">
              Beş yıllık birlikteliğimizde birçok güzel anıya imza attık. Seyahatlerimiz, 
              güzel yemek deneyimlerimiz, arkadaşlarımızla geçirdiğimiz keyifli akşamlar... 
              Her geçen gün birbirimizi daha iyi tanıdık ve aşkımız büyüdü.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Evlilik Teklifi</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Geçtiğimiz sonbaharda, her zamanki gibi sahil kenarında yürüyüş yaparken, 
              Çağatay dizlerinin üstüne çöktü ve hayatımın en güzel sorusunu sordu. 
              Tabii ki cevabımız "EVET!" oldu. O an, zamanın durduğunu hissettik.
            </p>
            
            <h3 className="font-serif text-2xl font-semibold mb-4">Gelecek Hayallerimiz</h3>
            <p className="text-gray-600 leading-relaxed">
              Şimdi hayatımızın en özel gününe hazırlanırken, gelecekle ilgili 
              hayallerimizi paylaşmanın heyecanını yaşıyoruz. Birlikte kuracağımız 
              yuva ve yaşayacağımız güzel anılar için sabırsızlanıyoruz.
            </p>
          </div>
          
          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
            alt="Evlilik teklifi kutlaması"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
