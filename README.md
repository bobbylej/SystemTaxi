# SystemTaxi

Aplikacja z wykorzystaniem [Sails](http://sailsjs.org) i [Angular](https://angularjs.org/).

System do usprawnienia i ułatwienia pracy pracownika centrali firmy taksówkowej w zakresie planowania kursów.
W [dokumantacji](https://github.com/bobbylej/SystemTaxi/blob/master/doc/dokumentacja.pdf) uwzględniono przegląd istniejących rozwiązań oraz szczegółowy projekt systemu.
Opisano również najważniejsze elementy implementacji.
[Dokumentacja](https://github.com/bobbylej/SystemTaxi/blob/master/doc/dokumentacja.pdf) zawiera instrukcję instalacji serwera i użytkowania systemu.

Do planowania kursów (określania najlepszych konfiguracji taksówkarzy z kursami) został wykorzystany algorytm (mojego autorstwa) oparty o algorytm genetyczny, wykorzystujący między innymi odległość na mapie przy użyciu [Google Maps API](https://developers.google.com/maps/web/).
