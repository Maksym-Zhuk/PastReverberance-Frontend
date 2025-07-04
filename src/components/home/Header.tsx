import { User2 } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="lg:hidden flex justify-between items-center w-full h-[9dvh] bg-white sticky top-0 px-5">
      <h2 className="text-xl font-bold">PastReverberance</h2>
      <Link
        href={'/profile'}
        className="w-11 h-11 bg-black rounded-sm flex justify-center items-center"
      >
        <User2 className="text-white" />
      </Link>
    </div>
  );
}
