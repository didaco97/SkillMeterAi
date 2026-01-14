import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyCertificate() {
    const [searchParams] = useSearchParams();
    const certId = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!certId) {
            setLoading(false);
            return;
        }

        const verifyCert = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/certificates/verify/${certId}/`);
                if (!response.ok) {
                    throw new Error('Certificate not found or invalid');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        verifyCert();
    }, [certId]);

    if (!certId) {
        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-red-500">Invalid Link</CardTitle>
                        <CardDescription>No certificate ID provided.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <Card className={`border-2 shadow-xl ${error ? 'border-red-200 bg-red-50/10' : 'border-green-200 bg-green-50/10'}`}>
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
                            {error ? (
                                <XCircle className="h-10 w-10 text-red-500" />
                            ) : (
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold font-heading">
                            {error ? 'Invalid Certificate' : 'Certificate Verified'}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {error ? 'This certificate ID does not exist in our records.' : 'This certificate is authentic and valid.'}
                        </CardDescription>
                    </CardHeader>

                    {!error && data && (
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-1 text-center">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Awarded To</p>
                                <h3 className="text-xl font-bold text-foreground">{data.student_name}</h3>
                            </div>

                            <div className="space-y-1 text-center">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Course Completed</p>
                                <div className="flex items-center justify-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    <h3 className="text-xl font-bold text-primary">{data.course_title}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-dashed">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Completion Date</p>
                                    <div className="flex items-center justify-center gap-1.5 font-medium">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(data.completion_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                                    <div className="font-mono text-sm">{new Date(data.issue_date).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="bg-background/50 rounded-lg p-3 text-center border">
                                <p className="text-xs text-muted-foreground">Certificate ID</p>
                                <code className="text-xs font-mono font-bold">{data.certificate_id}</code>
                            </div>
                        </CardContent>
                    )}

                    <div className="p-4 text-center border-t bg-muted/20">
                        <p className="text-xs text-muted-foreground">Verified by SkillMeter AI</p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
