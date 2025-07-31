import {
  Inter,
  Quicksand,
  Rubik
} from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export { inter, quicksand,rubik };
