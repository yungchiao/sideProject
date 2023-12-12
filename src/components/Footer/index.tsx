import { observer } from "mobx-react-lite";
const Footer: React.FC = observer(() => {
  return (
    <div className=" z-99 bottom-0  flex h-20 w-full items-center justify-center gap-8 bg-brown py-3">
      <div className="h-8 w-8 cursor-pointer bg-[url('/facebook.png')] bg-contain" />
      <div className="h-8 w-8 cursor-pointer bg-[url('/line.png')] bg-contain" />
      <div className="h-8 w-8 cursor-pointer bg-[url('/twitter.png')] bg-contain" />
    </div>
  );
});

export default Footer;
