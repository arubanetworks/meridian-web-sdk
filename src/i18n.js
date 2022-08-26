import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      defaultTransParent: "div", // needed for preact
      wait: true,
    },
    resources: {
      en: {
        translation: {
          tags: "Tags",
          placemarks: "Placemarks",
          floors: "Floors",
          search: "Search",
          search_tags: "Search Tags",
          search_placemarks: "Search Placemarks",
          search_floors: "Search Floors",
          no_results_found: "No results found",
          close: "Close",
        },
      },
      ar: {
        translation: {
          tags: "العلامات",
          placemarks: " العلامات الموضعية",
          floors: " الطوابق",
          search: " بحث",
          search_tags: " بحث عن علامات",
          search_placemarks: " بحث عن علامات موضعية",
          search_floors: " بحث عن طوابق",
          no_results_found: " لم يتم العثور على نتائج",
          close: "إغلاق",
        },
      },
      ca: {
        translation: {
          tags: "Etiquetes",
          placemarks: "Marques de posició",
          floors: "Pisos",
          search: "Cerca",
          search_tags: "Cerca etiquetes",
          search_placemarks: "Cerca marcadors de posició",
          search_floors: "Cerca pisos",
          no_results_found: "Sense resultats",
          close: "Tanca",
        },
      },
      es: {
        translation: {
          tags: "Etiquetas",
          placemarks: "Marcas de posición",
          floors: "Pisos",
          search: "Buscar",
          search_tags: "Buscar etiquetas",
          search_placemarks: "Buscar marcas de posición",
          search_floors: "Buscar pisos",
          no_results_found: "No se han encontrado resultados",
          close: "Cerrar",
        },
      },
      cs: {
        translation: {
          tags: "Tagy",
          placemarks: "Značky míst",
          floors: "Patra",
          search: "Hledat",
          search_tags: "Hledat tagy",
          search_placemarks: "Hledat značky míst",
          search_floors: "Hledat patra",
          no_results_found: "Nebyly nalezeny žádné výsledky",
          close: "Zavřít",
        },
      },
      de: {
        translation: {
          tags: "Stichworte",
          placemarks: "Ortsmarken",
          floors: "Etagen",
          search: "Suche",
          search_tags: "Such-Tags",
          search_placemarks: "In den Ortsmarken (Räumen, Sälen) suchen",
          search_floors: "In den Stockwerken suchen",
          no_results_found: "Keine Ergebnisse gefunden",
          close: "Schließen",
        },
      },
      fr: {
        translation: {
          tags: "Mots clés",
          placemarks: "Repères",
          floors: "Étages",
          search: "Rechercher",
          search_tags: "Rechercher des mots clés",
          search_placemarks: "Rechercher des repères",
          search_floors: "Rechercher des étages",
          no_results_found: "Aucun résultat trouvé",
          close: "Fermer",
        },
      },
      it: {
        translation: {
          tags: "Tag",
          placemarks: "Segnaposto",
          floors: "Piani",
          search: "Cerca",
          search_tags: "Cerca tag",
          search_placemarks: "Cerca segnaposto",
          search_floors: "Cerca piani",
          no_results_found: "Nessun risultato trovato",
          close: "Chiudi",
        },
      },
      iw: {
        translation: {
          tags: "תגים",
          placemarks: "סימני מקום",
          floors: "קומות",
          search: "חפש",
          search_tags: "חפש תגיות",
          search_placemarks: "חפש סימני מקום",
          search_floors: "חפש קומות",
          no_results_found: "לא נמצאו תוצאות",
          close: "סגור",
        },
      },
      ja: {
        translation: {
          tags: "タグ",
          placemarks: "目印",
          floors: "フロア",
          search: "探す",
          search_tags: "検索タグ",
          search_placemarks: "目印を検索する",
          search_floors: "フロアを検索する",
          no_results_found: "結果が見つからない",
          close: "近い",
        },
      },
      ko: {
        translation: {
          tags: "태그",
          placemarks: "장소표시<",
          floors: "바닥",
          search: "검색",
          search_tags: "태그검색<",
          search_placemarks: "장소표시 검색<",
          search_floors: "층수검색<",
          no_results_found: "검색결과가 없습니다<",
          close: "닫기",
        },
      },
      nl: {
        translation: {
          tags: "Tags",
          placemarks: "Plaatsaanduidingen",
          floors: "Verdiepingen",
          search: "Zoeken",
          search_tags: "Zoek tags",
          search_placemarks: "Zoek plaatsaanduidingen",
          search_floors: "Zoek verdiepingen",
          no_results_found: "Geen resultaten gevonden",
          close: "Sluiten",
        },
      },
      no: {
        translation: {
          tags: "Tagger",
          placemarks: "Stedsmarkeringer",
          floors: "Gulv",
          search: "Søk",
          search_tags: "Søk i etiketter",
          search_placemarks: "Søk i stedsmarkeringer",
          search_floors: "Søk i etasjer",
          no_results_found: "Ingen resultater",
          close: "Lukk",
        },
      },
      pt: {
        translation: {
          tags: "Tags",
          placemarks: "Marcadores",
          floors: "Andares",
          search: "Procurar",
          search_tags: "Tags de pesquisa",
          search_placemarks: "Pesquisar marcadores",
          search_floors: "Pesquisar andares",
          no_results_found: "Nenhum resultado encontrado",
          close: "Perto",
        },
      },
      ru: {
        translation: {
          tags: "Taggar",
          placemarks: "Platsmärken",
          floors: "Golv",
          search: "Sök",
          search_tags: "Sök taggar",
          search_placemarks: "Sök efter platsmärken",
          search_floors: "Sök Golv",
          no_results_found: "Inga resultat funna",
          close: "Stänga",
        },
      },
      sv: {
        translation: {
          tags: "Taggar",
          placemarks: "Platsmärken",
          floors: "Golv",
          search: "Sök",
          search_tags: "Sök taggar",
          search_placemarks: "Sök efter platsmärken",
          search_floors: "Sök Golv",
          no_results_found: "Inga resultat funna",
          close: "Stänga",
        },
      },
      uk: {
        translation: {
          tags: "Теги",
          placemarks: "Мітки",
          floors: "Поверхи",
          search: "Пошук",
          search_tags: "Пошук тегів",
          search_placemarks: "Пошук міток",
          search_floors: "Пошук поверхів",
          no_results_found: "Нічого не знайдено",
          close: "Закрити",
        },
      },
      vi: {
        translation: {
          tags: "Thẻ",
          placemarks: "Dấu vị trí",
          floors: "Tầng",
          search: "Tìm kiếm ",
          search_tags: "Thẻ tìm kiếm",
          search_placemarks: "Dấu vị trí tìm kiếm",
          search_floors: "Tầng tìm kiếm",
          no_results_found: "Không có kết quả nào được tìm thấy",
          close: "Đóng",
        },
      },
      cn: {
        translation: {
          tags: "标签",
          placemarks: "地标",
          floors: "楼层",
          search: "搜索",
          search_tags: "搜索标签",
          search_placemarks: "搜索地标",
          search_floors: "搜索楼层",
          no_results_found: "未找到结果",
          close: "关闭",
        },
      },
      zh: {
        translation: {
          tags: "標籤",
          placemarks: "地標",
          floors: "樓層",
          search: "搜尋",
          search_tags: "搜尋標籤",
          search_placemarks: "搜尋地標",
          search_floors: "搜尋樓層",
          no_results_found: "未找到結果",
          close: "關閉",
        },
      },
    },
  });

export default i18n;
