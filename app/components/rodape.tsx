import { Marca } from "./marca";
import { TEXTO_DISCLAIMER } from "./disclaimer";

export function Rodape() {
  return (
    <footer className="border-t border-fio bg-papel px-5 py-10 lg:px-24">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
        <Marca />
        <p className="max-w-[70ch] text-apoio text-tinta-2">{TEXTO_DISCLAIMER}</p>
      </div>
    </footer>
  );
}
