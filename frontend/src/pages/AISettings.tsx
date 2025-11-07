/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { AlertCircle, Key, Bot, CheckCircle, XCircle } from "lucide-react";

interface AISettings {
  openai_api_key: string | null;
  enable_ai_analysis: boolean;
  ai_feedback_frequency: string;
}

export function AISettings() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState<{
    valid?: boolean;
    message?: string;
  } | null>(null);

  // 현재 설정 조회
  const { data: settings } = useQuery<AISettings>({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/ai/settings');
      return response.data
    },
  });

  // 설정 업데이트
  const updateMutation = useMutation({
    mutationFn: async (newSettings: Partial<AISettings>) => {
      const response = await apiClient.post('/v1/ai/settings', newSettings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiSettings'] });
      alert('설정이 저장되었습니다');
    },
  });

  // API 키 테스트
  const testMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiClient.post('/v1/ai/test-api-key', null, {
        params: { api_key: key },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setTestResult(data);
    },
  });

  // 피드백 생성
  const generateFeedbackMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/v1/ai/generate-feedback');
      return response.data;
    },
    onSuccess: (data) => {
      alert('피드백이 생성되었습니다!');
      console.log(data.feedback);
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || '피드백 생성에 실패했습니다');
    },
  });

  const handleSaveApiKey = () => {
    if (apiKey) {
      updateMutation.mutate({ openai_api_key: apiKey });
    }
  };

  const handleTestApiKey = () => {
    if (apiKey) {
      testMutation.mutate(apiKey);
    }
  };

  const handleToggleAI = () => {
    updateMutation.mutate({
      enable_ai_analysis: !settings?.enable_ai_analysis,
    });
  };

  const handleFrequencyChange = (frequency: string) => {
    updateMutation.mutate({ ai_feedback_frequency: frequency });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">AI 설정</h1>

      {/* OpenAI API 키 설정 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Key className="w-6 h-6 text-gray-700 mr-2" />
          <h2 className="text-xl font-semibold">OpenAI API 설정</h2>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">API 키 사용 안내</p>
              <ul className="list-disc list-inside space-y-1">
                <li>OpenAI API 키는 귀하의 개인 키를 사용합니다</li>
                <li>사용량에 따라 OpenAI에서 직접 요금이 청구됩니다</li>
                <li>
                  API 키는{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    OpenAI 대시보드
                  </a>
                  에서 발급받을 수 있습니다
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API 키
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={settings?.openai_api_key ? '기존 키가 설정되어 있습니다' : 'sk-...'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestApiKey}
                disabled={!apiKey || testMutation.isPending}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                테스트
              </button>
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKey || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                저장
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`flex items-center p-3 rounded-md ${
                testResult.valid
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {testResult.message}
            </div>
          )}
        </div>
      </div>

      {/* AI 기능 설정 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bot className="w-6 h-6 text-gray-700 mr-2" />
          <h2 className="text-xl font-semibold">AI 기능 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI 분석 활성화</p>
              <p className="text-sm text-gray-600">
                감정 기록에 대한 AI 분석을 활성화합니다
              </p>
            </div>
            <button
              onClick={handleToggleAI}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings?.enable_ai_analysis ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings?.enable_ai_analysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <p className="font-medium mb-2">피드백 생성 빈도</p>
            <div className="flex gap-2">
              {['daily', 'weekly', 'never'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleFrequencyChange(freq)}
                  className={`px-4 py-2 rounded-md ${
                    settings?.ai_feedback_frequency === freq
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {freq === 'daily' && '매일'}
                  {freq === 'weekly' && '매주'}
                  {freq === 'never' && '사용 안 함'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={() => generateFeedbackMutation.mutate()}
              disabled={!settings?.openai_api_key || generateFeedbackMutation.isPending}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {generateFeedbackMutation.isPending
                ? '생성 중...'
                : '지금 피드백 생성하기'}
            </button>
            {!settings?.openai_api_key && (
              <p className="text-sm text-red-600 mt-2">
                피드백을 생성하려면 먼저 OpenAI API 키를 설정해주세요.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 무료 기능 안내 */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-semibold mb-1">무료 기능</p>
            <p>
              HuggingFace 모델을 사용한 감정 분석은 무료로 제공됩니다. 
              OpenAI API 키 없이도 기본적인 감정 분석 기능을 사용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}