import { observer } from "mobx-react-lite";
const Footer: React.FC = observer(() => {
  return (
    <div className="fixed bottom-0 z-40 mt-10 flex h-20 w-full items-center justify-center gap-8 bg-stone-300 py-3">
      <div className="h-8 w-8 cursor-pointer bg-[url('/facebook.png')] bg-contain" />
      <div className="h-8 w-8 cursor-pointer bg-[url('/line.png')] bg-contain" />
      <div className="h-8 w-8 cursor-pointer bg-[url('/twitter.png')] bg-contain" />
    </div>
  );
});

export default Footer;
