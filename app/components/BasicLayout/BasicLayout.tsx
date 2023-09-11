import { Alerts } from '@/components';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import { BasicLayoutProps } from './BasicLayout.props';

const BasicLayout = ({ children }: BasicLayoutProps): JSX.Element => {
    return (
        <div className="grid min-h-screen grid-rows-basicLayout sm:grid-cols-12">
            <Header className="sm:col-span-12" />
            <main className="px-2.5 py-2.5 sm:col-span-10 sm:col-start-2 sm:col-end-12 sm:px-0">
                {children}
            </main>
            <Footer className="sm:col-span-12" />
            <Alerts />
        </div>
    );
};

export default BasicLayout;
