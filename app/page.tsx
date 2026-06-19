import { redirect } from 'next/navigation'

export default function RootPage() {
  // සයිට් එකට ආපු ගමන්ම කෙලින්ම (accounts)/login ෆෝල්ඩර් එකේ පිටුවට හරවලා යවනවා
  redirect('/login')
}
