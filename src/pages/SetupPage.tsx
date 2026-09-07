import { useNavigate } from "react-router-dom";
import UserRound from "@/components/ui/UserRound";

const SetupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md px-4 py-6 bg-page">
      <header className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="text-sm text-accent">
          ‹ Back
        </button>
        <h1 className="text-lg font-bold text-ink">Bagi Baru</h1>
      </header>

      <form id="bagiForm" onSubmit={(e) => e.preventDefault()} className="mb-6">
        <div>
          <label
            htmlFor="namaBagi"
            className="block text-[10px] font-semibold uppercase tracking-[1.4px] text-ink/55"
          >
            Nama Bagi
          </label>
          <input
            id="namaBagi"
            type="text"
            placeholder="Enter bagi name"
            className="w-full rounded border border-accent p-4 mt-1 mb-6 bg-card text-ink outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <div className="block text-[10px] font-semibold uppercase tracking-[1.4px] text-ink/55">Mode</div>
          <div role="radiogroup" aria-label="Mode" className="flex mt-2 w-full">
            <div className="flex flex-1 items-center border border-accent bg-accent rounded-l">
              <input id="form" type="radio" name="inputMode" value="form" defaultChecked className="sr-only" />
              <label htmlFor="form" className="flex-1 py-4 text-center text-sm font-medium text-page select-none">
                Form
              </label>
            </div>
            <div className="flex flex-1 items-center border border-accent bg-card rounded-r">
              <input id="ai" type="radio" name="inputMode" value="ai" className="sr-only" />
              <label htmlFor="ai" className="flex-1 py-4 text-center text-sm font-bold text-accent select-none">
                AI
              </label>
            </div>
          </div>
          <small className="text-xs text-ink/55">Form: Input manually, AI: Generate from text</small>
          <div className="border-t border-dashed border-accent my-6" />
        </div>
      </form>

      <div>
        <h2 className="mb-6 text-xl font-extrabold text-ink">Anggota</h2>

        <div id="listAnggota" className="mb-6 flex gap-6">
          <UserRound userInitial="RA" />
          <UserRound userInitial="RU" />
          <UserRound userInitial="RE" />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            aria-label="Nama Anggota"
            className="flex-2 mt-1 rounded border border-accent bg-card px-4 py-2.5 outline-none focus:border-accent"
            type="text"
            placeholder="Nama Anggota"
          />
          <button
            type="submit"
            className="flex-1 mt-1 rounded bg-accent py-2.5 text-sm text-page transition active:scale-95"
          >
            Tambah Anggota
          </button>
        </div>
        <small className="text-xs text-ink/55">
          <span className="font-mono">3/8</span> Anggota
        </small>
      </form>

      <button
        type="submit"
        form="bagiForm"
        className="w-full mt-1 mb-8 rounded bg-accent py-2.5 text-lg font-bold text-page transition active:scale-95"
      >
        Lanjut Item
      </button>
    </div>
  );
};

export default SetupPage;
