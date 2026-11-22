import { vi } from "vitest";

/** Estado controlável do mock de next/navigation. */
export const navegacao = {
  pathname: "/",
  searchParams: new URLSearchParams(),
  push: vi.fn(),
  replace: vi.fn((url: string) => {
    const [, query = ""] = url.split("?");
    navegacao.searchParams = new URLSearchParams(query);
  }),
  reset(pathname = "/", query = "") {
    navegacao.pathname = pathname;
    navegacao.searchParams = new URLSearchParams(query);
    navegacao.replace.mockClear();
    navegacao.push.mockClear();
  },
};

export class NotFoundError extends Error {}

export const mockNextNavigation = () => ({
  usePathname: () => navegacao.pathname,
  useSearchParams: () => navegacao.searchParams,
  useRouter: () => ({ replace: navegacao.replace, push: navegacao.push }),
  notFound: () => {
    throw new NotFoundError("NEXT_NOT_FOUND");
  },
});
