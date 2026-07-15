import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function WhatsAppButton() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const lang = i18n.language || 'tr';
  const isRtl = lang === 'ar';

  const waPhone = '905394611684';

  // Localized texts
  const content = {
    tr: {
      name: 'Samer Allaham',
      title: 'E-ticaret & Yazılım Uzmanı',
      status: 'Çevrimiçi',
      greeting: 'Merhaba! 👋 E-ticaret siteniz veya projeniz hakkında konuşalım. Size nasıl yardımcı olabilirim?',
      placeholder: 'Mesajınızı yazın...',
      button: 'Sohbete Başla',
    },
    en: {
      name: 'Samer Allaham',
      title: 'E-commerce & Software Expert',
      status: 'Online',
      greeting: "Hello! 👋 Let's talk about your e-commerce website or project. How can I help you?",
      placeholder: 'Type your message...',
      button: 'Start Chat',
    },
    ar: {
      name: 'سامر اللحام',
      title: 'خبير التجارة الإلكترونية والبرمجيات',
      status: 'نشط الآن',
      greeting: 'مرحباً! 👋 فلنتحدث عن موقع التجارة الإلكترونية الخاص بك أو مشروعك. كيف يمكنني مساعدتك؟',
      placeholder: 'اكتب رسالتك هنا...',
      button: 'بدء المحادثة',
    },
  };

  const texts = content[lang] || content.tr;

  const handleStartChat = (e) => {
    e.preventDefault();
    const finalMsg = message.trim() || texts.greeting;
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://wa.me/${waPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className={`fixed bottom-6 z-[999] flex flex-col items-end gap-4 ${isRtl ? 'left-6' : 'right-6'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`w-[320px] md:w-[360px] bg-[#161b26] border border-neutral-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 transform scale-100 origin-bottom flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128c7e] to-[#25d366] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              {/* Profile Avatar / Initial Badge */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white uppercase text-base border border-white/10 shrink-0">
                S
              </div>
              <div className="flex flex-col flex-grow">
                <span className="font-bold text-sm leading-tight">{texts.name}</span>
                <span className="text-[11px] text-white/80 leading-none mt-0.5">{texts.title}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                  <span className="text-[10px] text-green-100">{texts.status}</span>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              aria-label="Close chat"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body / Chat Bubbles */}
          <div 
            className="p-4 flex-grow min-h-[120px] bg-[#0b0f19] flex flex-col gap-3 justify-end overflow-y-auto"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff05 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          >
            <div className="flex flex-col gap-1 max-w-[85%] self-start">
              <div className="bg-[#1c2434] text-white px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-md border border-neutral-800 text-xs md:text-sm leading-relaxed">
                {texts.greeting}
              </div>
            </div>
          </div>

          {/* Footer Input & Action */}
          <form onSubmit={handleStartChat} className="p-3 bg-[#161b26] border-t border-neutral-800 flex flex-col gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={texts.placeholder}
              rows={2}
              className={`w-full bg-[#0b0f19] border border-neutral-800 rounded-xl px-3 py-2 text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#25d366] transition-colors resize-none ${isRtl ? 'text-right' : 'text-left'}`}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#128c7e] to-[#25d366] text-white font-bold py-2 px-4 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(37,211,102,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.023-5.101-2.883-6.963C16.592 1.94 14.12 .916 11.49.916c-5.437 0-9.863 4.414-9.866 9.85-.001 1.992.52 3.93 1.508 5.642L2.09 21.912l5.725-1.504c1.642.897 3.238 1.34 4.832 1.34zM17.47 14.39c-.3-.149-1.772-.874-2.047-.975-.275-.101-.475-.149-.675.15-.2.299-.775.975-.95 1.174-.175.199-.35.224-.65.075-.3-.149-1.265-.466-2.41-1.484-.89-.795-1.49-1.778-1.665-2.076-.175-.3-.018-.462.13-.61.134-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.007-.368-.009-.565-.009-.196 0-.517.074-.788.374-.27.3-1.032 1.01-1.032 2.461 0 1.45 1.053 2.85 1.2 3.05.149.2 2.072 3.166 5.02 4.444.702.304 1.25.486 1.677.621.706.224 1.348.193 1.856.117.567-.085 1.772-.724 2.022-1.424.25-.699.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z" />
              </svg>
              {texts.button}
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 bg-gradient-to-tr from-[#128c7e] to-[#25d366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25d366] focus:ring-offset-[#0b0f19] pointer-events-auto shrink-0"
        aria-label="Contact via WhatsApp"
        type="button"
      >
        {/* Pulsating outer rings */}
        <div className="absolute inset-0 rounded-full bg-[#25d366]/40 opacity-75 animate-ping -z-10" />
        
        {isOpen ? (
          // Close Icon when chat is open
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // WhatsApp Icon
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.023-5.101-2.883-6.963C16.592 1.94 14.12 .916 11.49.916c-5.437 0-9.863 4.414-9.866 9.85-.001 1.992.52 3.93 1.508 5.642L2.09 21.912l5.725-1.504c1.642.897 3.238 1.34 4.832 1.34zM17.47 14.39c-.3-.149-1.772-.874-2.047-.975-.275-.101-.475-.149-.675.15-.2.299-.775.975-.95 1.174-.175.199-.35.224-.65.075-.3-.149-1.265-.466-2.41-1.484-.89-.795-1.49-1.778-1.665-2.076-.175-.3-.018-.462.13-.61.134-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.172-.007-.368-.009-.565-.009-.196 0-.517.074-.788.374-.27.3-1.032 1.01-1.032 2.461 0 1.45 1.053 2.85 1.2 3.05.149.2 2.072 3.166 5.02 4.444.702.304 1.25.486 1.677.621.706.224 1.348.193 1.856.117.567-.085 1.772-.724 2.022-1.424.25-.699.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z" />
          </svg>
        )}
      </button>
    </div>
  );
}
