import { useEffect, useState } from "react";

import {
  AZURE_AI_TRANSLATOR_API_ENDPOINT,
  AZURE_AI_TRANSLATOR_API_KEY,
  AZURE_TEXT_TO_SPEECH_API_KEY,
  AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME,
  AZURE_RESOURCES_API_REGION,
} from "@/config/config";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { ibm_plex_sans } from "@/fonts";
import { AiFillSound } from "react-icons/ai";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { Language } from "@/config/interfaces";

export default function Home() {
  const [translateFrom, setTranslateFrom] = useState<Language | null>(null);
  const [translateTo, setTranslateTo] = useState<Language | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");

  useEffect(() => {
    fetch("/languages.json")
      .then((response) => response.json())
      .then((data) => {
        setTranslateFrom(data.languages[0]);
        setTranslateTo(data.languages[1]);
      });
  }, []);

  const translateText = async () => {
    setOutputText("Translating...");
    axios({
      baseURL: AZURE_AI_TRANSLATOR_API_ENDPOINT,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_AI_TRANSLATOR_API_KEY,
        "Ocp-Apim-Subscription-Region": AZURE_RESOURCES_API_REGION,
        "Content-Type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: translateFrom?.code.substring(0, 2),
        to: [translateTo?.code.substring(0, 2)],
      },
      data: [
        {
          text: inputText,
        },
      ],
      responseType: "json",
    })
      .then(function (response) {
        const translated = response.data[0].translations[0].text;
        setOutputText(translated);
      })
      .catch(function (error) {
        console.error(error);
        alert("Erro na chamada da API");
      });
  };

  const playTranslation = () => {
    if (outputText) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        AZURE_TEXT_TO_SPEECH_API_KEY || "",
        AZURE_RESOURCES_API_REGION || ""
      );
      const speechSynthesizer = new sdk.SpeechSynthesizer(
        speechConfig,
        undefined
      );

      const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME}"><lang xml:lang="${translateTo?.code}">${outputText}</lang></voice></speak>`;
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.errorDetails) {
            console.error(result.errorDetails);
          }

          speechSynthesizer.close();
        },
        (error) => {
          console.log(error);
          speechSynthesizer.close();
        }
      );
    }
  };

  const swapLanguage = () => {
    setTranslateFrom(translateTo);
    setTranslateTo(translateFrom);
    setInputText("");
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
          <h3 className="text-2xl mb-8">From {translateFrom?.language}</h3>
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
          onClick={translateText}
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
          <h3 className="text-2xl mb-8">To {translateTo?.language}</h3>
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
          onClick={playTranslation}
        >
          <AiFillSound />
        </button>
      </section>
    </main>
  );
}
