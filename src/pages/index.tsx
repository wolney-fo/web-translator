import { API_ENDPOINT, API_KEY, API_LOCATION } from "@/config/config";
import { ibm_plex_sans } from "@/fonts";
import axios from "axios";
import { useState } from "react";
const { v4: uuidv4 } = require("uuid");

const translateFrom = "English";
const translateTo = "Portuguese";

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");

  const translateText = async () => {
    axios({
      baseURL: API_ENDPOINT,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Ocp-Apim-Subscription-Region": API_LOCATION,
        "Content-Type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: "en",
        to: ["pt"],
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

  return (
    <main className={`py-8 text-center text-white ${ibm_plex_sans.className}`}>
      <section className="py-8 mx-auto w-[min(50rem,70%)]">
        <div className="py-8">
          <h3 className="text-2xl mb-8">From {translateFrom}</h3>
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
          className="py-2 w-full max-w-[24rem] bg-[#0f62fe] hover:bg-[#0353e9]"
          onClick={translateText}
        >
          Translate
        </button>

        <div className="py-8">
          <h3 className="text-2xl mb-8">To {translateTo}</h3>
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
      </section>
    </main>
  );
}
