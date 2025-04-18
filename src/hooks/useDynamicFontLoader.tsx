import { useEffect } from "react";

const useDynamicFontLoader = (fontFamily: string) => {
  useEffect(() => {
    // load font in document head dynamically;
    let linkElement = document.head?.querySelector("#font-link");
    const href = `https://fonts.googleapis.com/css2?family=${fontFamily?.replaceAll(
      " ",
      "+"
    )}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;

    if (!linkElement) {
      linkElement = document.createElement("link");
      document.head.appendChild(linkElement);
    }

    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", href);
  }, [fontFamily]);

  return null;
};

export default useDynamicFontLoader;
