import Image from "next/image";
import { ibm_plex_sans } from "@/fonts";

const translateFrom = "Portuguese";
const translateTo = "English";

export default function Home() {
  return (
    <main className={`py-8 text-center text-white ${ibm_plex_sans.className}`}>
      <section className="py-8 mx-auto w-[min(50rem,70%)]">
        <div className="py-8">
          <h3 className="text-2xl mb-8">From {translateFrom}</h3>
          <textarea
            name="translateFrom"
            id="translateFrom"
            value={"Olá mundo :D"}
            className="bg-[#262626] py-2 px-4 w-full"
            rows={7}
            autoComplete="off"
          ></textarea>
        </div>

        <button className="py-2 w-full max-w-[24rem] bg-[#0f62fe] hover:bg-[#0353e9]">
          Translate
        </button>
        
        <div className="py-8">
          <h3 className="text-2xl mb-8">To {translateTo}</h3>
          <textarea
            name="translateFrom"
            id="translateFrom"
            value={"Hello world :D"}
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
