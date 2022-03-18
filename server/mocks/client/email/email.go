package fakes

import "sync"

type IFace struct {
	SendAuthCodeCall struct {
		mutex     sync.Mutex
		CallCount int
		Receives  struct {
			ToEmail string
			Code    string
		}
		Returns struct {
			Error error
		}
		Stub func(string, string) error
	}
	SendEmailCall struct {
		mutex     sync.Mutex
		CallCount int
		Receives  struct {
			ToEmail string
			Subject string
			Msg     string
		}
		Returns struct {
			Error error
		}
		Stub func(string, string, string) error
	}
}

func (f *IFace) SendAuthCode(param1 string, param2 string) error {
	f.SendAuthCodeCall.mutex.Lock()
	defer f.SendAuthCodeCall.mutex.Unlock()
	f.SendAuthCodeCall.CallCount++
	f.SendAuthCodeCall.Receives.ToEmail = param1
	f.SendAuthCodeCall.Receives.Code = param2
	if f.SendAuthCodeCall.Stub != nil {
		return f.SendAuthCodeCall.Stub(param1, param2)
	}
	return f.SendAuthCodeCall.Returns.Error
}
func (f *IFace) SendEmail(param1 string, param2 string, param3 string) error {
	f.SendEmailCall.mutex.Lock()
	defer f.SendEmailCall.mutex.Unlock()
	f.SendEmailCall.CallCount++
	f.SendEmailCall.Receives.ToEmail = param1
	f.SendEmailCall.Receives.Subject = param2
	f.SendEmailCall.Receives.Msg = param3
	if f.SendEmailCall.Stub != nil {
		return f.SendEmailCall.Stub(param1, param2, param3)
	}
	return f.SendEmailCall.Returns.Error
}
