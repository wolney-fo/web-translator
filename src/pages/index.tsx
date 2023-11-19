import { useEffect, useState } from "react";

import { ibm_plex_sans } from "@/fonts";
import { AiFillSound } from "react-icons/ai";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { Language } from "@/config/interfaces";
import { translateText } from "./api/azureAiTranslator";
import { textToSpeech } from "./api/azureTextToSpeech";

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translateFrom, setTranslateFrom] = useState<Language>();
  const [translateTo, setTranslateTo] = useState<Language>();
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");

  useEffect(() => {
    fetch("/languages.json")
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data.languages);
        setTranslateFrom(data.languages[0]);
        setTranslateTo(data.languages[1]);
      });
  }, []);

  const handleTranslateText = async () => {
    try {
      setOutputText("Translating...");

      if (translateFrom && translateTo) {
        const translatedText = await translateText(
          inputText,
          translateFrom?.code,
          translateTo?.code
        );

        console.log(translateText);

        setOutputText(String(translatedText));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayTranslation = () => {
    try {
      if (outputText && translateTo) {
        textToSpeech(outputText, translateTo.code);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const swapLanguage = () => {
    setTranslateFrom(translateTo);
    setTranslateTo(translateFrom);
    setInputText("");
    setOutputText("");
  };

  const handleChangeLanguageFrom = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const languageCode = event.target.value;
    const languageObject = languages.find(
      (language) => language.code === languageCode
    );
    setTranslateFrom(languageObject);
    setInputText("");
  };

  const handleChangeLanguageTo = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const languageCode = event.target.value;
    const languageObject = languages.find(
      (language) => language.code === languageCode
    );
    setTranslateTo(languageObject);
    setOutputText("");
  };

  return (
    <main className={`py-8 text-center text-white ${ibm_plex_sans.className}`}>
      <a
        className="rounded-xl py-2 px-4 fixed bottom-4 right-4 bg-[#0f62fe] hover:bg-[#0353e9]"
        href="https://github.com/wolney-fo/web-translator/"
        target="_blank"
      >
        ⭐ Considere star
      </a>

      <section className="flex flex-col center py-8 mx-auto w-[min(50rem,70%)]">
        <div className="py-8">
          <div className="flex mb-12 items-center justify-center gap-2">
            <h3 className="text-2xl">From</h3>
            <select
              value={translateFrom?.code}
              onChange={handleChangeLanguageFrom}
              className="cursor-pointer py-4 px-6 border-b border-[#5e5e5e] bg-[#262626]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="translateFrom"
            id="translateFrom"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-[#262626] py-2 px-4 w-full"
            rows={7}
            autoComplete="off"
          ></textarea>
        </div>

        <button
          className="mx-auto py-2 w-full max-w-[24rem] bg-[#0f62fe] hover:bg-[#0353e9]"
          onClick={handleTranslateText}
        >
          Translate
        </button>

        <button
          className="my-8 mx-auto p-4 bg-[#262626] hover:bg-[#353535]"
          onClick={swapLanguage}
        >
          <HiOutlineSwitchVertical />
        </button>

        <div className="py-8">
          <div className="mb-12 flex items-center justify-center gap-2">
            <h3 className="text-2xl">To</h3>
            <select
              value={translateTo?.code}
              onChange={handleChangeLanguageTo}
              className="cursor-pointer py-4 px-6 border-b border-[#5e5e5e] bg-[#262626]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="translateFrom"
            id="translateFrom"
            value={outputText}
            className="bg-[#262626] py-2 px-4 w-full"
            rows={7}
            autoComplete="off"
            disabled
          ></textarea>
        </div>

        <button
          className="text-center mx-auto py-2 px-4 bg-[#0f62fe] hover:bg-[#0353e9]"
          onClick={handlePlayTranslation}
        >
          <AiFillSound />
        </button>
      </section>
    </main>
  );
}
