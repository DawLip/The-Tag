backend server    => localhost:3010
altair            => localhost:3010/altair/ // zapytania wysyłacie normalnie na "/", /altair to jest tylko GUI
socket.io server  => localhost:3011
MongoDB server    => mongodb://localhost:27017/test // każdy musi sobie sam lokalnie zainstalować

frontend server   => localhost:3000

do działania
- zainstalować node js 
- zainstalować npm jeżeli nie ma
- cd backend
- npm i

odpalenie
- npm run start:dev