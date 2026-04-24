import { useAppDispatch, useAppSelector } from '../../redux/hook/hooks'; // Your redux hooks
import { hideAlert } from '../../redux/reducers/alertSlice';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

const GlobalAlert = () => {
    const dispatch = useAppDispatch();
    const { type, message, isVisible } = useAppSelector((state) => state.alert);
    console.log(type, message, isVisible)
    useEffect(() => {

        if (isVisible) {
            const timer = setTimeout(() => dispatch(hideAlert()), 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, dispatch]);

    if (!isVisible || !type) return null;

    const styles = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800 icon-emerald',
        error: 'bg-red-50 border-red-200 text-red-800 icon-red',
        warning: 'bg-amber-50 border-amber-200 text-amber-800 icon-amber',
        info: 'bg-blue-50 border-blue-200 text-blue-800 icon-blue',
    };

    return (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-10 duration-300 ${styles[type]}`}>
            {type === 'success' && <CheckCircle2 size={20} />}
            {type === 'error' && <XCircle size={20} />}
            {/* ... other icons ... */}

            <p className="text-sm font-semibold">{message}</p>

            <button onClick={() => dispatch(hideAlert())} className="ml-2">
                <X size={16} />
            </button>
        </div>
    );
};

export default GlobalAlert