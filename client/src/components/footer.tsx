import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="font-serif text-3xl font-semibold mb-2">Mihbiran & Çağatay</h3>
          <p className="text-gray-300">15 Haziran 2024</p>
        </div>
        
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
            data-testid="social-instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
            data-testid="social-facebook"
          >
            <Facebook size={24} />
          </a>
        </div>
        
        <p className="text-gray-400 text-sm">
          Bu özel günümüzü bizimle paylaştığınız için teşekkürler
        </p>
      </div>
    </footer>
  );
}
